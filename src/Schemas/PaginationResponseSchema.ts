type PaginationResponseSchema = {
    Message: {
        Title: string | null,
        Content: string
    },
    Content: {
        Meta:{
            page: number,
            size: number,
            count: number,
            maxPage:number,
            search: string | null
        },
        Data: any[]
    }
}

export default PaginationResponseSchema;