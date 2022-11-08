exports.templateResponse = (status, success, msg, data, error) => {
    return {
        status,
        success,
        msg,
        data,
        error
    }
}

exports.okSample = (data) => {
    return this.templateResponse(this.data.CODE.OK, this.data.STATUS.true, this.data.SUCCESS.OK, data)
}

exports.systemError = (status, error) => {
    return this.templateResponse(this.data.CODE.INTERNALSERVERERROR, this.data.STATUS.false, this.data.SYSTEM_ERROR, "", error)
}

exports.data = {
    CODE: {
        OK: 200,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOTFOUND: 404,
        BADREQUEST: 400,
        METHODENOTALLOWED: 405,
        CONFLICT:409,
        INTERNALSERVERERROR:500
    },
    UNREGISTERED: {
        ACCOUNT: 'unregistered account',
        EMAIL: 'unregistered email',
        PHONE: 'unregistered phone'
    },
    WRONG: {
        PASSWORD: 'incorrect password',
        EMAIL: 'incorrect email',
        PHONE: 'incorrect phone',
        BOTH: 'incorrect request',
        AUTH: 'unauthorized.',
        OTP: 'not have an otp yet'

    },
    STATUS:{
        true:true,
        false:false
    },
    SUCCESS: {
        LOGIN: 'login successfully',
        ACCOUNT: 'account successfully registered',
        OTP: 'authentication code successfully sent',
        CHANGE: {
            PASSWORD: 'password has been changed'
        },
        OK: 'ok',
        TRANSACTION: 'transaction success',
        PROMO_CATEGORY: 'changed successfull',
        SOCIAL_MEDIA: 'connected'
    },
    FAILED: {
        LOGIN: 'login unsuccessful',
        ACCOUNT: 'account unsuccessful registered',
        REGISTERED: 'account already registered',
        SYSTEM: 'action unsuccessful',
        TRANSACTION: 'Your Currency Is Not Enough',
        PROMO: {
            NOTFOUND: "promo is not found",
            LACK_CURRENCY: 'Your Currency Is Not Enough'
        }
    },
    SUBJECT: {
        OTP: 'Your BagiData Code Authentication',
        FORGOT: 'Your BagiData Code Authentication',
        BOTH: 'Your BagiData OTP Code'
    },
    MODELS: {
        USER: 'user',
        USER_PERSONAL: 'user_personal_information',
        OTP_USER: 'otp_end_user'
    },
    INVALID_FORMAT_PARAMETER:'invalid_parameter',
    INVALID_FORMAT_DATE :{
        msg: "invalid_date"
    },
    INVALID_FORMAT_TIME :{
        msg: "invalid_time"
    },
    EMPTY: 'empty',
    DEFAULT_LIMIT: 10,
    DEFAULT_OFFSET: 0,
    QUOTA_ERROR: 'quota_error',
    SYSTEM_ERROR: 'system_error'
}