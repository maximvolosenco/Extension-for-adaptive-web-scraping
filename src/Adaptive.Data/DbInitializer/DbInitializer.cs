using Adaptive.Data.SeedFunctions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Adaptive.Data.DbInitializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly DevelopmentSeed _developmentSeed;
        public DbInitializer(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
            _developmentSeed = new DevelopmentSeed();
        }

        public void Initialize()
        {
            using (var serviceScope = _scopeFactory.CreateScope())
            {
                using var context = serviceScope.ServiceProvider.GetService<AdaptiveContext>();
                try
                {
                    context.Database.Migrate();

//#if DEBUG
//                    _developmentSeed.Seed(context);
//#endif
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }
    }
}
