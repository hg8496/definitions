import {janitza} from '../lib';
import IEnergySnapshot = janitza.values.IEnergySnapshot;
import IInput = janitza.values.IInput;
import EnergySnapshot = janitza.values.EnergySnapshot;

const payloadSnapshotFull: IEnergySnapshot = {
    day: new Date().toISOString().substr(0, 10),
    timeSlot: 0,
    input: {channel: 1} as IInput,
    timebase: janitza.values.TimeBase.Minutes15,
    activeEnergy: 1.1, activeEnergyConsumed: 1.2, activeEnergySupplied: 1.3, activePower: 1.4,
    reactiveEnergy: 2.1, reactiveEnergyConsumed: 2.2,reactiveEnergySupplied: 2.3, reactivePower: 2.4,
    apparentEnergy: 3.1, apparentEnergyConsumed: 3.2, apparentEnergySupplied: 3.2, apparentPower: 3.4
};

const payloadSnapshotActive: IEnergySnapshot = {
    day: new Date().toISOString().substr(0, 10),
    timeSlot: 0,
    input: {channel: 1} as IInput,
    timebase: janitza.values.TimeBase.Minutes15,
    activeEnergy: 1.1, activeEnergyConsumed: 1.2, activeEnergySupplied: 1.3, activePower: 1.4
};

test("Full snapshot set", () => {
    const snapshot = EnergySnapshot.create(payloadSnapshotFull);
    const data = EnergySnapshot.encodeDelimited(snapshot).finish();
    expect(data.length).toBe(131);
    expect(EnergySnapshot.verify(snapshot)).toBe(null);
});

test("Active snapshot set", () => {
    const snapshot = EnergySnapshot.create(payloadSnapshotActive);
    const data = EnergySnapshot.encodeDelimited(snapshot).finish();
    expect(data.length).toBe(57);
    expect(EnergySnapshot.verify(snapshot)).toBe(null);
});