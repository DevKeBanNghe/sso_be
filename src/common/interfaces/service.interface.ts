export interface CreateService<T = unknown> {
  create(createDto: T);
}

export interface UpdateService<T = unknown> {
  update(updateDto: T);
}

export interface DeleteService<T = number[]> {
  remove(ids: T);
}

export interface GetDetailService<T = number> {
  getDetail(id: T);
}

export interface GetAllService<T = unknown> {
  getAll(getAllDto?: T);
}

export interface GetOptionsService<T = unknown> {
  getOptions(getOptionsDto?: T);
}
