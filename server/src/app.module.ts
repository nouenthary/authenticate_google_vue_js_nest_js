import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./auth/entities/user.entity";

@Module({
    imports: [
        // Load environment variables from .env file
        // ConfigModule.forRoot({
        //     envFilePath: '.env',  // Load the .env file
        //     isGlobal: true,  // Makes the variables available globally across the application
        // }),
        //
        // // Configure TypeORM with environment variables
        // TypeOrmModule.forRoot({
        //     useFactory: async () => ({
        //         type: 'postgres',  // Postgres SQL database
        //         host: process.env.DB_HOST,  // Use value from .env
        //         port: +process.env.DB_PORT,  // Convert port to number
        //         username: process.env.DB_USERNAME,
        //         password: process.env.DB_PASSWORD,
        //         database: process.env.DB_NAME,
        //         entities: [User],  // Register your entities here
        //         synchronize: process.env.DB_SYNC === 'true',  // Sync based on .env value
        //         logging: true,  // Enable logging for debugging
        //     }),
        // }),

        ConfigModule.forRoot({
            isGlobal: true, // Makes environment variables available globally
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User],
            synchronize: process.env.DB_SYNC === 'true', // Set to false in production
        }),

        //TypeOrmModule.forFeature([User]),
        //
        AuthModule
    ],
    exports:[

    ]
    // controllers: [AppController],
    // providers: [AppService],

})
export class AppModule {
}
