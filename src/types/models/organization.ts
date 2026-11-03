export interface Organization {
    id: string
    ownerId: string
    name: string
    inn: string
    address: string | null
    createdAt: Date
    updatedAt: Date
}

export type OrganizationCreate= Pick<Organization, 'name' | 'inn'| 'address'>