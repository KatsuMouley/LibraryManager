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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Ordem estava inversa
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();


