//app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './services/database.service';
import { AuthModule } from './auth/auth.module';
import { InvitationModule } from './invitation/invitation.module';
// import { OnfidoService } from './onfido/onfido.service';
// import { OnfidoModule } from './onfido/onfido.module';
import { AlpacaModule } from './alpaca/alpaca.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { MerchantModule } from './merchant/merchant.module';
import { ProfileModule } from './profile/profile.module';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    InvitationModule,
    AlpacaModule,
    // OnfidoModule,
    BankAccountModule,
    MerchantModule,
    ProfileModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
  // providers: [AppService, DatabaseService, OnfidoService],
})
export class AppModule {}
