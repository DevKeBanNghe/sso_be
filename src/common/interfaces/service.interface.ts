export interface CreateService<T> {
  create(createDto: T);
}

export interface UpdateService<T> {
  update(id: number, updateDto: T);
}

export interface DeleteService {
  remove(id: number);
}

export interface GetDetailService {
  getDetail(id: number);
}

export interface GetAllService {
  getAll();
}
