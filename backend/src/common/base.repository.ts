import { Model, Document } from 'mongoose';
import { FilterQuery } from 'mongoose';


export interface PaginationOptions {
    page?: number; // default 1
    limit?: number; // default 10
    filters?: Record<string, any>; // key-value filter
    sort?: Record<string, 1 | -1>; // { field: 1 } or { field: -1 }
}

export class BaseRepository<T extends Document> {
    constructor(private readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const newEntity = new this.model(data);
        return newEntity.save();
    }

    async findAll(options: PaginationOptions = {}) {
        const {
            page = 1,
            limit = 10,
            filters = {},
            sort = {},
        } = options;

        const skip = (page - 1) * limit;

        // Build dynamic filters (supports partial text search for strings)
        const query: FilterQuery<T> = {};
        for (const key in filters) {
            if (typeof filters[key] === 'string') {
                (query as any)[key] = { $regex: filters[key], $options: 'i' }; // case-insensitive search
            } else {
                (query as any)[key] = filters[key];
            }
        }

        const [data, totalCount] = await Promise.all([
            this.model.find(query).sort(sort).skip(skip).limit(limit).exec(),
            this.model.countDocuments(query).exec(),
        ]);

        return {
            data,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        };
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(filter: object): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async update(id: string, updateData: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }


    // 🔹 New function: findAll with selected fields
    async findAllSelect(filter: object = {}, selectFields: string[] = []): Promise<T[]> {
        const projection = selectFields.length ? selectFields.join(' ') : null;
        return this.model.find(filter, projection).exec();
    }

    // 🔹 New function: findOne with selected fields
    async findOneSelect(filter: object = {}, selectFields: string[] = []): Promise<T | null> {
        const projection = selectFields.length ? selectFields.join(' ') : null;
        return this.model.findOne(filter, projection).exec();
    }
}
