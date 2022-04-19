using Adaptive.Data;
using Adaptive.Data.DbInitializer;
using Adaptive.Data.Repository;
using Adaptive.Data.UnitOfWork;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF core  
builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddDbContext<AdaptiveContext>(options => options.UseSqlServer("Data Source=.;Initial Catalog=AdaptiveDb;Integrated Security=True"));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
