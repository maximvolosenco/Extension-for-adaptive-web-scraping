using Adaptive.Data;
using Adaptive.Data.DbInitializer;
using Adaptive.Data.Repository;
using Adaptive.Data.UnitOfWork;
using Microsoft.EntityFrameworkCore;

//string? adaptiveAppOriginsName = "_adaptiveAppOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
                //.WithOrigins("http://example.com",
                //                "http://www.contoso.com");
        });
    //options.AddPolicy(name: adaptiveAppOriginsName,
    //                  policy =>
    //                  {
    //                      policy.WithOrigins("http://example.com",
    //                                          "http://www.contoso.com");
    //                  });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF core  
builder.Services.AddDbContext<AdaptiveContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));

// set up mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Initialize database
ActivatorUtilities.CreateInstance<DbInitializer>
    (app.Services).Initialize();

//app.UseCors(adaptiveAppOriginsName);
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
