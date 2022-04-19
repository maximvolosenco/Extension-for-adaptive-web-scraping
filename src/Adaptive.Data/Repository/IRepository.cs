using Microsoft.EntityFrameworkCore.Query;
using Adaptive.DataObjects;
using System.Linq.Expressions;

namespace Adaptive.Data.Repository
{
    public interface IRepository<TEntity> where TEntity : Entity, new()
    {
        TEntity SingleOrDefault(
           Expression<Func<TEntity, bool>>? filter = null,
           Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
           Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
           bool enableTracking = true,
           bool ignoreQueryFilters = false);

        IQueryable<TResult> GetList<TResult>(
            Expression<Func<TEntity, TResult>> selector,
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
            bool enableTracking = true) where TResult : class;

        void Insert(IEnumerable<TEntity> entities);
        void Insert(params TEntity[] entities);
        TEntity Insert(TEntity entity);

        void Update(IEnumerable<TEntity> entities);
        void Update(params TEntity[] entities);
        void Update(TEntity entity);

        void Delete(IEnumerable<TEntity> entities);
        void Delete(params TEntity[] entities);
        void Delete(TEntity entity);

        void Dispose();
    }
}
