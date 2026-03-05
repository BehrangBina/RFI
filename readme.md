docker run --name rfi-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=rfi_db `
  -p 5432:5432 `
  -d postgres:latest

docker start rfi-postgres


  
dotnet ef migrations add init-admin --context AdminDbContext   
 dotnet ef migrations add init-app --context ApplicationDbContext   


   dotnet ef database update --context AdminDbContext
   
   dotnet ef database update --context ApplicationDbContext