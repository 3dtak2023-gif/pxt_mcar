
/**
 * SIYEENOVE mCar extension test
 * Step 6: Safe functional verification
 *
 * A button : Run motors at 25% for 500ms
 * B button : Stop motors immediately
 * IR key 1 : Count received commands
 * IR OK    : Stop motors
 * Sensors  : Send 3-bit line state to serial
 *
 * IMPORTANT:
 * Keep the robot's wheels off the ground during testing.
 */

// Stop both wheels at startup.
mCar.carStop()

let irCount = 0
let motorTestRunning = false

// A button: short, low-speed motor test.
input.onButtonPressed(Button.A, function () {
    if (motorTestRunning) {
        return
    }

    motorTestRunning = true
    serial.writeLine("Motor test START")

    mCar.setWheelSpeed(25, 25)
    basic.pause(500)
    mCar.carStop()

    motorTestRunning = false
    serial.writeLine("Motor test STOP")
})

// B button: emergency stop.
input.onButtonPressed(Button.B, function () {
    mCar.carStop()
    motorTestRunning = false
    serial.writeLine("B button STOP")
})

// Infrared receiver test.
mCar.irCallBack(function () {
    if (mCar.irButton(mCar.McarIRButtons.Number1)) {
        irCount += 1
        serial.writeValue("IR_Count", irCount)
    }

    if (mCar.irButton(mCar.McarIRButtons.OK)) {
        mCar.carStop()
        motorTestRunning = false
        serial.writeLine("IR OK STOP")
    }
})

// Read the three tracking sensors.
basic.forever(function () {
    mCar.trackbitStateValue()

    let lineState = mCar.returnGrayscaleSensorValue()

    serial.writeValue("Line", lineState)

    basic.pause(100)
})
