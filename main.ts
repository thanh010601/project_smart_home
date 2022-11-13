function TEMP_HUMI_LCD () {
    counter_lcd += 1
    if (counter_lcd >= 50) {
        counter_lcd = 0
        NPNBitKit.DHT11Read(DigitalPin.P0)
        NPNLCD.clear()
        NPNLCD.ShowString("NHIET DO: " + ("" + NPNBitKit.DHT11Temp()), 0, 0)
        NPNLCD.ShowString("DO AM: " + ("" + NPNBitKit.DHT11Hum()), 0, 1)
        NPNLCD.ShowString("" + RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR) + ":" + RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE), 11, 0)
    }
}
function MOISTURE_AND_PUMP () {
    if (NPNBitKit.AnalogSoilMosture(AnalogPin.P3) < 30) {
        NPNBitKit.Relay(DigitalPin.P2, true)
    } else {
        NPNBitKit.Relay(DigitalPin.P2, false)
    }
}
function RC_CLOSE_DOOR () {
    if (counter_rc <= 0) {
        pins.servoWritePin(AnalogPin.P16, 0)
    } else {
        counter_rc += -1
    }
}
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_A_DOWN) {
        fan_status = 1 - fan_status
        if (fan_status == 0) {
            pins.analogWritePin(AnalogPin.P9, 1023)
        } else {
            pins.analogWritePin(AnalogPin.P9, 0)
        }
    }
})
function CO2_AND_ALARM () {
    if (pins.analogReadPin(AnalogPin.P10) >= 700) {
        pins.digitalWritePin(DigitalPin.P6, 1)
        pins.digitalWritePin(DigitalPin.P7, 0)
    } else if (pins.analogReadPin(AnalogPin.P10) >= 500) {
        pins.digitalWritePin(DigitalPin.P6, 1)
        pins.digitalWritePin(DigitalPin.P7, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P6, 0)
        pins.digitalWritePin(DigitalPin.P7, 1)
    }
}
function DOOR_AND_BELL () {
    if (NPNBitKit.ButtonDoorOpen(DigitalPin.P5)) {
        NPNBitKit.Led2ColorAnalog(AnalogPin.P4, 50, AnalogPin.P0, 0)
    } else {
        NPNBitKit.Led2Color(DigitalPin.P4, false, DigitalPin.P0, false)
    }
}
function SOUND_AND_FAN () {
    if (NPNBitKit.AnalogSound(AnalogPin.P1) > 30) {
        fan_status = 1 - fan_status
        if (fan_status == 0) {
            pins.analogWritePin(AnalogPin.P9, 1023)
        } else {
            pins.analogWritePin(AnalogPin.P9, 0)
        }
    }
}
NFC.nfcEvent(function () {
    myID = NFC.getUID()
    if (myID == "D539A53D") {
        basic.showIcon(IconNames.Heart)
        pins.servoWritePin(AnalogPin.P16, 0)
        counter_rc = 30
    } else if (myID == "85C33F33") {
        basic.showIcon(IconNames.Happy)
        pins.servoWritePin(AnalogPin.P16, 0)
        counter_rc = 30
    } else {
        basic.clearScreen()
    }
})
let myID = ""
let counter_rc = 0
let fan_status = 0
let counter_lcd = 0
led.enable(false)
NPNLCD.LcdInit()
counter_lcd = 0
let counter_bell = 0
fan_status = 0
pins.digitalWritePin(DigitalPin.P8, 0)
NFC.NFC_setSerial(SerialPin.P8, SerialPin.P12)
basic.forever(function () {
    RC_CLOSE_DOOR()
    CO2_AND_ALARM()
    SOUND_AND_FAN()
    MOISTURE_AND_PUMP()
    DOOR_AND_BELL()
    TEMP_HUMI_LCD()
    basic.pause(100)
})
