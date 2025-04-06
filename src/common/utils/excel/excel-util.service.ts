import { BadRequestException, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { GenerateExcelParams } from './interfaces/excel-util.interface';
import { StringUtilService } from '../string/string-util.service';
import { isEmpty, startCase, uniq } from 'lodash';

@Injectable()
export class ExcelUtilService {
  constructor(private stringUtilService: StringUtilService) {}

  private customHeaders({ worksheet }) {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }
  async generateExcel({ worksheets = [] }: GenerateExcelParams) {
    if (worksheets.length === 0)
      throw new BadRequestException('Worksheets is empty!');

    const workbook = new Workbook();
    for (const { sheetName = 'Sheet Name', data = [] } of worksheets) {
      if (data.length === 0) continue;
      const worksheet = workbook.addWorksheet(sheetName);

      const dataColumns = Object.keys(data[0]);
      const widthColumn = Math.floor(100 / dataColumns.length);
      const columns = dataColumns.map((column) => ({
        header: startCase(column),
        key: column,
        width: widthColumn,
      }));
      worksheet.columns = columns;
      worksheet.addRows(data);

      this.customHeaders({ worksheet });
    }

    return await workbook.xlsx.writeBuffer();
  }

  private addCCheckbox({ cell }) {
    cell.dataValidation = {
      type: 'list',
      formulae: ['"TRUE,FALSE"'],
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  async generateExcelScrollInfinity({ worksheets = [] }: GenerateExcelParams) {
    if (worksheets.length === 0)
      throw new BadRequestException('Worksheets is empty!');

    const workbook = new Workbook();
    for (const { sheetName = 'Sheet Name', data = [] } of worksheets) {
      if (data.length === 0) continue;
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.views = [
        {
          state: 'frozen',
          xSplit: 1,
          ySplit: 1,
          activeCell: 'A1',
        },
      ];

      const columns = uniq<any>(Object.values(data).flat());
      const A1Cell = {
        header: '',
        width: 40,
      };
      const widthColumn = Math.floor(100 / columns.length);
      const columnsData = columns.map((column) => ({
        header: column,
        key: column,
        width: widthColumn,
      }));
      worksheet.columns = [A1Cell, ...columnsData];

      const lastColIndex = worksheet.lastColumn.number;
      Object.entries<Record<string, any>>(data).forEach(
        ([row, columns], index) => {
          for (let colIndex = 1; colIndex <= lastColIndex; colIndex++) {
            const cell = worksheet.getCell(index + 2, colIndex);

            if (colIndex === 1) {
              cell.value = row;
              continue;
            }

            this.addCCheckbox({ cell });
            const column = worksheet.getCell(1, colIndex).value;
            cell.value = columns.includes(column);
          }
        }
      );

      const isFakeRow = isEmpty(worksheet.lastRow.values[1]);
      if (isFakeRow) {
        worksheet.spliceRows(worksheet.lastRow.number, 1);
      }
      const headerColumn = worksheet.getColumn(1);
      headerColumn.font = { bold: true };
      headerColumn.alignment = { vertical: 'middle' };
      headerColumn.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      this.customHeaders({ worksheet });
    }

    return await workbook.xlsx.writeBuffer();
  }

  async read({ file }) {
    if (!file) throw new BadRequestException('File not found!');
    const workbook = new Workbook();
    await workbook.xlsx.readFile(file.path);
    const sheetsData = workbook.worksheets.reduce((acc, worksheet) => {
      const sheetData = [];
      const headers = worksheet.getRow(1);
      const fields = (headers.values as any[]).filter((item) => Boolean(item));
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rowData = row.values as any;
        const value = fields.reduce((acc, item, index) => {
          const field = this.stringUtilService.convertToField(item);
          return { ...acc, [field]: rowData[index + 1] };
        }, {});
        sheetData.push(value);
      });
      return { ...acc, [worksheet.name]: sheetData };
    }, {});

    return sheetsData;
  }

  async readScrollInfinity({ file }) {
    if (!file) throw new BadRequestException('File not found!');
    const workbook = new Workbook();
    await workbook.xlsx.readFile(file.path);
    const sheetsData = workbook.worksheets.reduce((acc, worksheet) => {
      const sheetData = {};
      const headers = worksheet.getRow(1);
      const columns = (headers.values as any[]).filter((item) => Boolean(item));
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rowData = row.values as any;
        const rowValue = rowData[1];
        columns.forEach((column, index) => {
          const rowValueCurrent = sheetData[rowValue];
          if (!rowValueCurrent) sheetData[rowValue] = [];
          const isChecked = rowData[index + 2];
          if (!isChecked) return;
          sheetData[rowValue].push(column);
        });
      });
      return { ...acc, [worksheet.name]: sheetData };
    }, {});
    return sheetsData;
  }
}
