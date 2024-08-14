const base_url = "https://dummyjson.com/";

export default async function handleAPIrequest(endpoint, success, fail, loading, stoploading) 
{
    loading();
    try {
        const res = await fetch(`${base_url}${endpoint}`);
        if (res.ok) 
        {
            const data = await res.json();
            success(data);
        } else 
        {
            throw new Error("Something went wrong");
        }
    } catch (e) 
    {
        console.log(e);
        fail(e);
    } finally 
    {
        stoploading();
    }
}
