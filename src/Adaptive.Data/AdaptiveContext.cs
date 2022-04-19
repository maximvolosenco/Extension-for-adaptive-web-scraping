using Adaptive.DataObjects;
using Microsoft.EntityFrameworkCore;

namespace Adaptive.Data
{
    public class AdaptiveContext : DbContext
    {
        public AdaptiveContext() { }

        public AdaptiveContext(DbContextOptions<AdaptiveContext> options) : base(options) { }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            //Uncomment line below to enable EF Lazy Loading
            //optionsBuilder.UseLazyLoadingProxies();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
