using System.Text;
using Biblioteca.Data;
using Biblioteca.Modelos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.
    Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDataContext>
    (options => options.UseMySql(connectionString, 
    ServerVersion.AutoDetect(connectionString)));
builder.Services.
    AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.
    AddScoped<ILivroRepository, LivroRepository>();
builder.Services.
    AddScoped<IEmprestimoRepository, EmprestimoRepository>();
builder.Services.
    AddScoped<IAutorRepository, AutorRepository>();



var chaveJwt = builder.Configuration["JwtSettings:SecretKey"];


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
			ClockSkew = TimeSpan.Zero,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(chaveJwt!))
        };
    });

builder.Services.AddAuthorization();


// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("FrontCorsPolicy", policy =>
//     {
//         policy
//             .WithOrigins("http://localhost:3000")    // URL do seu Next.js
//             .AllowAnyHeader()                         // permite Authorization, Content-Type, etc.
//             .AllowAnyMethod()                         // GET, POST, PUT, DELETE…
//             .AllowCredentials();                      // se precisar enviar cookies ou auth
//     });
// });

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .AllowAnyOrigin() // <--- cuidado com isso
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Ordem estava inversa
app.UseCors("DevCors");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();


