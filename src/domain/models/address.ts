import { Schema } from "mongoose";

export interface Address {
    building: string;
    street: string;
    town: string;
    county?: string;
    postcode: string;
    createdAt: Date;
    updatedAt: Date;
}


export const AddressSchema = new Schema<Address>({
    building: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    town: {
        type: String,
        required: true,
    },
    county: {
        type: String
    },
    postcode: {
        type: String,
        required: true,
    }
}, {
    _id: false,
    timestamps: true,
    versionKey: false,
});
