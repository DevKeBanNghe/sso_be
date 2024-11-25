export interface CreateService<T = unknown> {
  create(createDto: T);
}

export interface UpdateService<T = unknown> {
  update(updateDto: T | T[]);
}

export interface DeleteService<T = string[]> {
  remove(ids: T);
}

export interface GetDetailService<T = string> {
  getDetail(id: T);
}

export interface GetAllService<T = unknown> {
  getAll(getAllDto?: T);
}

export interface GetOptionsService<T = unknown> {
  getOptions(getOptionsDto?: T);
}

export interface GetInstanceService {
  getInstance();
}
