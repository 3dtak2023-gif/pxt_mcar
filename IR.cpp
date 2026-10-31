#include "pxt.h"

//% color=50 weight=80
//% icon="\uf1eb"
namespace mCarInfrared {

// All durations are in microseconds.
static const uint32_t IDLE_TIMEOUT_US = 20000;
static const uint32_t HEADER_TIMEOUT_US = 12000;
static const uint32_t SPACE_TIMEOUT_US = 6000;
static const uint32_t BIT_TIMEOUT_US = 2500;
static const uint32_t PULSE_TIMEOUT_US = 70000;

int ir_code = 0;
int ir_addr = 0;
int data = 0;
static bool has_previous_code = false;

static bool wait_for_level(int level, uint32_t timeout_us) {
    uint32_t start = system_timer_current_time_us();
    while (uBit.io.P9.getDigitalValue() != level) {
        if ((uint32_t)(system_timer_current_time_us() - start) >= timeout_us)
            return false;
    }
    return true;
}

static int pulse_duration(int level, uint32_t start_timeout_us,
                          uint32_t duration_timeout_us) {
    if (!wait_for_level(level, start_timeout_us))
        return -1;
    uint32_t start = system_timer_current_time_us();
    while (uBit.io.P9.getDigitalValue() == level) {
        if ((uint32_t)(system_timer_current_time_us() - start) >= duration_timeout_us)
            return -1;
    }
    return (int)((uint32_t)(system_timer_current_time_us() - start));
}

static int logic_value() {
    int mark = pulse_duration(0, BIT_TIMEOUT_US, BIT_TIMEOUT_US);
    if (mark < 350 || mark > 850)
        return -1;
    int space = pulse_duration(1, BIT_TIMEOUT_US, BIT_TIMEOUT_US);
    if (space >= 350 && space <= 850)
        return 0;
    if (space >= 1350 && space <= 1950)
        return 1;
    return -1;
}

static bool pulse_deal() {
    int address = 0;
    int command = 0;
    for (int i = 0; i < 16; i++) {
        int bit = logic_value();
        if (bit < 0) return false;
        address |= bit << i;
    }
    for (int i = 0; i < 16; i++) {
        int bit = logic_value();
        if (bit < 0) return false;
        command |= bit << i;
    }
    int command_low = command & 0xff;
    int command_high = (command >> 8) & 0xff;
    if ((command_low ^ command_high) != 0xff)
        return false;
    ir_addr = address;
    ir_code = command;
    has_previous_code = true;
    return true;
}

static void remote_decode() {
    data = 0;
    int header_mark = pulse_duration(0, IDLE_TIMEOUT_US, HEADER_TIMEOUT_US);
    if (header_mark < 8000 || header_mark > 10000)
        return;

    int header_space = pulse_duration(1, SPACE_TIMEOUT_US, SPACE_TIMEOUT_US);
    if (header_space >= 4000 && header_space <= 5000) {
        if (pulse_deal()) data = ir_code;
        return;
    }
    if (header_space >= 2000 && header_space <= 2500) {
        // NEC repeat frames contain no new command.
        // Do not call the MakeCode callback again for a held button.
        (void)pulse_duration(0, BIT_TIMEOUT_US, BIT_TIMEOUT_US);
        data = 0;
    }
}

//%
int irCode() {
    remote_decode();
    return data;
}

//%
int readPulseIn(int status) {
    return pulse_duration(status == 1 ? 1 : 0,
                          PULSE_TIMEOUT_US, PULSE_TIMEOUT_US);
}

}
