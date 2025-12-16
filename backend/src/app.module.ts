import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { PropriedadesModule } from './properties/properties.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Lead } from './entities/lead.entity';
import { PropriedadeRural } from './entities/propriedade-rural.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'leads_db',
      entities: [Lead, PropriedadeRural],
      synchronize: true, // Em produção, usar migrations
      logging: true,
    }),
    LeadsModule,
    PropriedadesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
