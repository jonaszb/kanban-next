import { APIRequestContext, APIResponse } from '@playwright/test';
import { Board, Column, NewColumn, NewTask, RequestOptionsNoBody, RequestOptionsWithBody, Task } from '../types';

export default class TestApiUtils {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    private get: CrudRequest = async (url, options = {}) => {
        return await this.request.get(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    private post: CrudRequest = async (url, options = {}) => {
        return await this.request.post(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    private put: CrudRequest = async (url, options = {}) => {
        return await this.request.put(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    private delete: CrudRequest = async (url, options = {}) => {
        return await this.request.delete(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    /* BOARDS */

    getBoards: AsyncGetFn<Board[]> = async (options?) => {
        const response = await this.get('/api/boards', options);
        return options?.rawResponse ? response : await response.json();
    };

    getBoard: AsyncGetFnWithParam<Board> = async (uuid: string, options?) => {
        const response = await this.get(`/api/boards/${uuid}`, options);
        return options?.rawResponse ? response : await response.json();
    };

    createBoard: AsyncPostFn<{ name: string; columns?: NewColumn[] }, Board> = async (payload, options?) => {
        const response = await this.post('/api/boards', { data: payload, ...options });
        return options?.rawResponse ? response : await response.json();
    };

    updateBoard: AsyncPutFn = async (uuid, payload, options?) => {
        return await this.put(`/api/boards/${uuid}`, { data: payload, ...options });
    };

    deleteBoard: AsyncDeleteFn = async (uuid, options?) => {
        return await this.delete(`/api/boards/${uuid}`, options);
    };

    getBoardByName = async (name: string) => {
        const boards = await this.getBoards();
        return boards.find((board) => board.name === name);
    };

    /* COLUMNS */

    getColumns: AsyncGetFn<Column[]> = async (options?) => {
        const response = await this.get(`/api/columns`, options);
        return options?.rawResponse ? response : await response.json();
    };

    getColumn: AsyncGetFnWithParam<Column> = async (uuid: string, options?) => {
        const response = await this.get(`/api/columns/${uuid}`, options);
        return options?.rawResponse ? response : await response.json();
    };

    createColumn: AsyncPostFn<NewColumn, Column> = async (payload, options?) => {
        const response = await this.post(`/api/columns`, { data: payload, ...options });
        return options?.rawResponse ? response : await response.json();
    };

    deleteColumn: AsyncDeleteFn = async (uuid, options?) => {
        return await this.delete(`/api/columns/${uuid}`, options);
    };

    getColumnByName = async (name: string) => {
        const columns = await this.getColumns();
        return columns.find((column) => column.name === name);
    };

    updateColumn: AsyncPutFn = async (uuid, payload, options?) => {
        return await this.put(`/api/columns/${uuid}`, { data: payload, ...options });
    };

    /* TASKS */

    getTasks: AsyncGetFn<Task[]> = async (options?) => {
        const response = await this.get(`/api/tasks`, options);
        return options?.rawResponse ? response : await response.json();
    };

    getTask: AsyncGetFnWithParam<Task> = async (uuid: string, options?) => {
        const response = await this.get(`/api/tasks/${uuid}`, options);
        return options?.rawResponse ? response : await response.json();
    };

    createTask: AsyncPostFn<NewTask, Task> = async (payload, options?) => {
        const response = await this.post(`/api/tasks`, { data: payload, ...options });
        return options?.rawResponse ? response : await response.json();
    };

    updateTask: AsyncPutFn = async (uuid, payload, options?) => {
        return await this.put(`/api/tasks/${uuid}`, { data: payload, ...options });
    };

    deleteTask: AsyncDeleteFn = async (uuid, options?) => {
        return await this.delete(`/api/tasks/${uuid}`, options);
    };

    getTaskByName = async (name: string) => {
        const tasks = await this.getTasks();
        return tasks.find((task) => task.name === name);
    };

    /* SUBTASKS */

    updateSubtask: AsyncPutFn = async (uuid, payload, options?) => {
        return await this.put(`/api/subtasks/${uuid}`, { data: payload, ...options });
    };
}

type CrudRequest = (url: string, options?: RequestOptionsWithBody & { rawResponse?: boolean }) => Promise<APIResponse>;

type InferType<T> = T extends infer U ? U : never;

type AsyncPostFn<Payload, ReturnType> = <R extends boolean>(
    payload: Payload,
    options?: RequestOptionsWithBody & {
        /**
         * Whether to return APIResponse instead of parsed response.
         * If true, failOnStatusCode will be false by default.
         */
        rawResponse?: R;
    }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncDeleteFn = (id: string, options?: RequestOptionsNoBody) => Promise<APIResponse>;

type AsyncGetFn<ReturnType> = <R extends boolean>(
    options?: RequestOptionsNoBody & {
        /**
         * Whether to return APIResponse instead of parsed response.
         * If true, failOnStatusCode will be false by default.
         */
        rawResponse?: R;
    }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncGetFnWithParam<ReturnType> = <R extends boolean>(
    param: string,
    options?: RequestOptionsNoBody & {
        /**
         * Whether to return APIResponse instead of parsed response.
         * If true, failOnStatusCode will be false by default.
         */
        rawResponse?: R;
    }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncPutFn = (param: string, payload: object, options?: RequestOptionsNoBody) => Promise<APIResponse>;
