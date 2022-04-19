using Adaptive.Data.Repository;
using Adaptive.DataObjects;

namespace Adaptive.Data.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<TEntity> GetRepository<TEntity>() where TEntity : Entity, new();

        void BeginTransaction();

        void CommitTransaction();

        int SaveChanges();

    }
}
