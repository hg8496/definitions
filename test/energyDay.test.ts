import {janitza} from '../lib';
import IEnergyDay = janitza.values.IEnergyDay;
import IInput = janitza.values.IInput;
import EnergyDay = janitza.values.EnergyDay;
import ValueStream = janitza.values.ValueStream;

const payloadEnergyPartial: IEnergyDay = {
    day: new Date().toISOString().substr(0, 10),
    input: {channel: 1} as IInput,
};

test("Verifiable day set", () => {
    const day = EnergyDay.create(payloadEnergyPartial);
    day.activeEnergy = ValueStream.create({timebase: janitza.values.TimeBase.Minutes15});
    for(let i = 0; i < 86; ++i) {
        day.activeEnergy.values[i] = i;
    }
    const data = EnergyDay.encodeDelimited(day).finish();
    expect(data.length).toBe(714);
    expect(EnergyDay.verify(day)).toBe(null);
});
