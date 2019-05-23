import {janitza} from '../lib';
import IEnergyDay = janitza.values.IEnergyDay;
import IInput = janitza.values.IInput;
import EnergyDay = janitza.values.EnergyDay;
import ValueStream = janitza.values.ValueStream;

const payloadEnergyPartial: IEnergyDay = {
    day: new Date().toISOString().substr(0, 10),
};

test("Verifiable day set", () => {
    const day = EnergyDay.create(payloadEnergyPartial);
    day.values = [];
    const vs = ValueStream.create({timebase: janitza.values.TimeBase.Minutes15, input: {channel: 1} as IInput, type: janitza.values.EnergyValueType.ActiveEnergyConsumed});
    day.values.push(vs);
    for(let i = 0; i < 86; ++i) {
        vs.values[i] = i;
    }
    const data = EnergyDay.encodeDelimited(day).finish();
    expect(data.length).toBe(716);
    expect(EnergyDay.verify(day)).toBe(null);
});
