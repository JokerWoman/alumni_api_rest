const config = {
    /* don't expose password or any sensitive info, done only for demo */
    // if environment variables are not defined, use default values
    HOST: process.env.DB_HOST || 'sql4.freemysqlhosting.net',
    USER: process.env.DB_USER || 'sql4405171',
    PASSWORD: process.env.DB_PASSWORD || 'AP5cgHimMv',
    DB: process.env.DB_NAME || 'sql4405171'
};
module.exports = config;