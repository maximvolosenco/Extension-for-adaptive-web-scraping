using Adaptive.Data.Repository;
using Adaptive.DataObjects;
using Microsoft.EntityFrameworkCore.Storage;

namespace Adaptive.Data.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AdaptiveContext _context;
        private IDbContextTransaction _transaction;
        private Dictionary<(Type type, string Name), IDisposable> _repositories;

        public UnitOfWork(AdaptiveContext context)
        {
            _repositories = new Dictionary<(Type type, string Name), IDisposable>();
            _context = context;
        }

        public IRepository<TEntity> GetRepository<TEntity>() where TEntity : Entity, new()
        {
            return (IRepository<TEntity>)GetOrAddRepository(typeof(TEntity), new Repository<TEntity>(_context));
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public void BeginTransaction()
        {
            if (_transaction == null)
            {
                _transaction = _context.Database.BeginTransaction();
            }
            else
            {
                throw new Exception("Transaction already in progress");
            }
        }

        public void CommitTransaction()
        {
            if (_transaction == null)
            {
                throw new Exception("No transaction to commit");
            }

            _transaction.Commit();
            _transaction.Dispose();
        }

        private IDisposable GetOrAddRepository(Type type, IDisposable repo)
        {
            var typeName = repo.GetType().FullName;
            if (_repositories.TryGetValue((type, typeName), out var repository))
            {
                return repository;
            }

            _repositories.Add((type, typeName), repo);

            return repo;
        }

        public void Dispose()
        {
            foreach (var key in _repositories.Keys)
            {
                _repositories[key].Dispose();
            }
            _repositories = null;
            _context?.Dispose();
        }
    }
}

