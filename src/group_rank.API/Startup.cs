using group_rank.API.Data;  // Your data namespace
using Microsoft.Extensions.Configuration;  // Add this to access IConfiguration
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;  // Add this to access UseSqlServer

public class Startup
{
    // Inject IConfiguration into the Startup class
    public IConfiguration Configuration { get; }

    // Constructor to assign the injected IConfiguration to a local property
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();

        // Use the injected Configuration object to get the connection string
        services.AddDbContext<PollContext>(options => 
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
