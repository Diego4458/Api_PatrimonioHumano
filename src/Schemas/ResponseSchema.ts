type ResponseSchema = {
    Message: {
        Title: string | null,
        Content: string
    },
    Content: any | null;
}

export default ResponseSchema;