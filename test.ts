
/**
 * SIYEENOVE mCar extension test
 * Original functions preserved
 * Step 6: Fix wheel control argument order
 */

// Infrared remote control
mCar.irCallBack(function () {
    if (mCar.irButton(mCar.McarIRButtons.Up)) {
        mCar.carDirectionSpeed(mCar.McarDir.FW, 100)
    }

    if (mCar.irButton(mCar.McarIRButtons.Down)) {
        mCar.carDirectionSpeed(mCar.McarDir.BW, 100)
    }

    if (mCar.irButton(mCar.McarIRButtons.Left)) {
        mCar.carTurn(mCar.McarTurn.Left, 50, 100)
    }

    if (mCar.irButton(mCar.McarIRButtons.Right)) {
        mCar.carTurn(mCar.McarTurn.Right, 50, 100)
    }

    if (mCar.irButton(mCar.McarIRButtons.OK)) {
        mCar.carStop()
    }

    // Uncomment to display received IR codes.
    // if (mCar.irValue() != 0) {
    //     basic.showNumber(mCar.irValue())
    // }
})

// Wheel speed calibration
mCar.wheelsAdjustment(0, 0)

// Check forward direction command
basic.pause(1000)
mCar.setWheelDirectionSpeed(
    mCar.McarWheels.AllWheel,
    mCar.WheelDir.FW,
    0
)

// Check backward direction command
basic.pause(1000)
mCar.setWheelDirectionSpeed(
    mCar.McarWheels.AllWheel,
    mCar.WheelDir.BW,
    0
)

// Stop left wheel
basic.pause(1000)
mCar.wheelStop(mCar.McarWheels.LeftWheel)

// RGB headlights
mCar.singleHeadlights(
    mCar.McarRGBLight.RGBA,
    255,
    255,
    255
)

// Battery level
basic.showNumber(
    mCar.batteryLevel(mCar.BatteryType.AA)
)

// Firmware version
basic.pause(1000)
basic.showString(mCar.readVersions())

basic.pause(1000)

// Tracking sensor, ultrasonic sensor and servo tests
basic.forever(function () {

    // Read three tracking sensors
    mCar.trackbitStateValue()

    // All three sensors read state 1
    if (mCar.readGrayscaleSensorState(
        mCar.TrackbitStateType.TrackingState0
    )) {
        basic.showIcon(IconNames.No)
        basic.pause(1000)
    }

    // Servo S1: 0 degrees
    mCar.extendServoControl(
        mCar.McarServoIndex.S1,
        mCar.ServoType.Servo180,
        0
    )

    // All three sensors read state 0
    if (mCar.readGrayscaleSensorState(
        mCar.TrackbitStateType.TrackingState7
    )) {
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
    }

    // Ultrasonic distance measurement
    basic.showNumber(
        mCar.sonar(mCar.SonarUnit.Centimeters)
    )

    basic.pause(1000)

    // Servo S1: 180 degrees
    mCar.extendServoControl(
        mCar.McarServoIndex.S1,
        mCar.ServoType.Servo180,
        180
    )
})
