const API_URL = "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json" 

export async function fetchHeroes (){
    try {
        const response = await fetch (API_URL)
        if (!response.ok){
            throw new Error (`HTTP error! status: ${response.status}`);
        }
           const data = await response.json();

     return Array.isArray(data) ? data : [];
    }
    catch (error){
      console.error ("error Fetch Superheroes", error)
      return []
    }
}