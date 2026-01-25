
export const EnvConfiguration = () => ({
    app:{
        port:process.env.PORT,
        environment:process.env.ENVIRONMENT,
        jwtSecret:process.env.JWT_SECRET,
        jwtExpiresIn:process.env.JWT_EXPIRES_IN
    },
    database:{
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        name:process.env.DB_NAME,
        username:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD
    }
})