import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { ProjetModule } from './projet/projet.module';
import { SalarieModule } from './salarie/salarie.module';
import { MaterielModule } from './materiel/materiel.module';
import { InterventionModule } from './intervention/intervention.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // Prisma Module (Global)
    PrismaModule,

    // GraphQL Module
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),

    // App Modules
    AuthModule,
    ClientModule,
    ProjetModule,
    SalarieModule,
    MaterielModule,
    InterventionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT Guard (can be bypassed with @Public() decorator)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Roles Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
