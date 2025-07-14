import {ObjectId} from 'mongodb';

export interface Link {
  _id?: ObjectId;
  url: string;
  title: string;
  description: string;
  dateAdded: Date;
}

export interface CreateLinkInput {
  url: string;
  title: string;
  description: string;
}

export interface UpdateLinkInput {
  url?: string;
  title?: string;
  description?: string;
}

export interface LinkRepository {
  create(input: CreateLinkInput): Promise<Link>;
  findById(id: string): Promise<Link | null>;
  findAll(): Promise<Link[]>;
  update(id: string, input: UpdateLinkInput): Promise<Link | null>;
  delete(id: string): Promise<boolean>;
}
