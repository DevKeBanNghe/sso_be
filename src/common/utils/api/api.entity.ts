import { PaginationList } from 'src/common/classes/pagination-list.class';

class FormatPagination<T = any> extends PaginationList {
  totalItems: number;
  totalPages?: number;
  list: T;
  constructor({ list, page, itemPerPage, totalItems }) {
    super();
    this.page = page;
    this.itemPerPage = itemPerPage;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.itemPerPage);
    this.list = list;
  }
}

export { FormatPagination };
