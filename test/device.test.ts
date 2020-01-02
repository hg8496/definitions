import {janitza} from '../lib';
import {Reader, Writer} from "protobufjs";
import * as fs from 'fs';
import * as temp from 'temp'
import Device = janitza.device.Device;
import IDevice = janitza.device.IDevice;

beforeAll(() => {
   // temp.track(true);
});

const payload604: IDevice = {
    deviceName: "deviceName",
    communication: "ip:192.168.2.222",
    deviceType: Device.DeviceType.UMG604,
    firmwareVersion: "5.008",
    serialNumber: "7000:0084",
    gridVisID: "default-1",
    referenceKey: "device:7000:0084"
};

test("Full set device", () => {
    const device = Device.create(payload604);
    const data = Device.encodeDelimited(device).finish();
    expect(data.length).toBe(80);
    expect(Device.verify(device)).toBe(null);
});

test("Write two in one file", () => {
    const writer: Writer = Writer.create();
    const device = Device.create(payload604);
    writer.fork();
    Device.encodeDelimited(device, writer);
    writer.fork();
    device.deviceType = Device.DeviceType.UMG605;
    device.serialNumber = "7000:0085";
    device.communication = "ip:192.168.2.223";
    Device.encodeDelimited(device, writer);
    const data = writer.finish();
    expect(data.length).toBe(160);
    expect(Device.verify(device)).toBe(null);
    const wStream = temp.createWriteStream('myBinaryFile');
    wStream.write(data);
    wStream.end();
});

test("Read full set 2 devices", () => {
    const buffer = fs.readFileSync('test/data/twoDevices');
    const reader = Reader.create(buffer);
    const device = Device.decodeDelimited(reader);
    expect(device.serialNumber).toBe("7000:0084");
    expect(device.deviceType).toBe(Device.DeviceType.UMG604);
    expect(Device.verify(device)).toBe(null);
    const device2 = Device.decodeDelimited(reader);
    expect(device2.serialNumber).toBe("7000:0085");
    expect(device2.deviceType).toBe(Device.DeviceType.UMG605);
    expect(device2.referenceKey).toBe(payload604.referenceKey);
    expect(Device.verify(device2)).toBe(null);
    expect(reader.pos).toBe(reader.len);
});

afterAll(() => {
  temp.cleanupSync();
});