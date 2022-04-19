using Adaptive.DataObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.Data.Repository
{
    public class Repository<TEntity> : IDisposable, IRepository<TEntity> where TEntity : Entity, new()
    {
        protected readonly AdaptiveContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        public Repository(AdaptiveContext context)
        {
            _context = context ?? throw new ArgumentException(nameof(context));
            _dbSet = _context.Set<TEntity>();
        }

        #region Get Functions
        public IQueryable<TResult> GetList<TResult>(
            Expression<Func<TEntity, TResult>>? selector,
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
            bool enableTracking = true) where TResult : class
        {
            IQueryable<TEntity> query = _dbSet;

            if (!enableTracking) query = query.AsNoTracking();

            if (include != null) query = include(query);

            if (filter != null) query = query.Where(filter);

            return orderBy != null ? orderBy(query).Select(selector) : query.Select(selector);
        }

        public TEntity? SingleOrDefault(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
            bool enableTracking = true,
            bool ignoreQueryFilters = false)
        {
            IQueryable<TEntity> query = _dbSet;

            if (!enableTracking) query = query.AsNoTracking();

            if (include != null) query = include(query);

            if (filter != null) query = query.Where(filter);

            if (ignoreQueryFilters) query = query.IgnoreQueryFilters();

            return orderBy != null ? orderBy(query).FirstOrDefault() : query.FirstOrDefault();
        }
        #endregion

        #region Insert Functions
        public virtual TEntity Insert(TEntity entity)
        {
            return _dbSet.Add(entity).Entity;
        }

        public void Insert(params TEntity[] entities)
        {
            _dbSet.AddRange(entities);
        }

        public void Insert(IEnumerable<TEntity> entities)
        {
            _dbSet.AddRange(entities);
        }
        #endregion

        #region Update Functions
        public void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }

        public void Update(params TEntity[] entities)
        {
            _dbSet.UpdateRange(entities);
        }

        public void Update(IEnumerable<TEntity> entities)
        {
            _dbSet.UpdateRange(entities);
        }
        #endregion

        #region Delete Functions
        public void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        public void Delete(params TEntity[] entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public void Delete(IEnumerable<TEntity> entities)
        {
            _dbSet.RemoveRange(entities);
        }
        #endregion

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
