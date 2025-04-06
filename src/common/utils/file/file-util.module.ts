import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterEnvs } from 'src/consts/env.const';
import { StringUtilService } from '../string/string-util.service';
import { StringUtilModule } from '../string/string-util.module';
import { basename, extname } from 'path';
import { DateUtilService } from '../date/date-util.service';
import { DateUtilModule } from '../date/date-util.module';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule, StringUtilModule, DateUtilModule],
      useFactory: async (
        configService: ConfigService,
        stringUtilService: StringUtilService,
        dateUtilService: DateUtilService
      ) => ({
        storage: diskStorage({
          destination: configService.get<string>(MulterEnvs.MULTER_DEST_FILE),
          filename: (req, file, callback) => {
            const extFile = extname(file.originalname);
            const fileName = stringUtilService.removeSpace(
              basename(file.originalname, extFile)
            );
            const currentDate = dateUtilService
              .getCurrentDate({
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour12: false,
              })
              .replace(/\//g, '_');
            callback(
              null,
              `${fileName}_${stringUtilService.random()}_${currentDate}${extFile}`
            );
          },
        }),
      }),
      inject: [ConfigService, StringUtilService, DateUtilService],
    }),
  ],
  exports: [MulterModule],
})
export class FileUtilModule {}
