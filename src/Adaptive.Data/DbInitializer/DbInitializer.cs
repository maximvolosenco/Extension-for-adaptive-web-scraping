using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.Data.DbInitializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public DbInitializer(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
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
                    //DevelopmentSeed.Seed(context);
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
