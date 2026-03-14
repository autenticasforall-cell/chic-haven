import { Link } from 'react-router-dom';
import { useFadeInOnScroll } from '@/hooks/useFadeIn';

const categories = [
  { name: 'Vestidos', handle: 'vestidos', emoji: '👗' },
  { name: 'Blusas', handle: 'blusas', emoji: '👚' },
  { name: 'Saias', handle: 'saias', emoji: '🩱' },
  { name: 'Calças', handle: 'calcas', emoji: '👖' },
  { name: 'Acessórios', handle: 'acessorios', emoji: '👜' },
];

const CategoryGrid = () => {
  const ref = useFadeInOnScroll();

  return (
    <section ref={ref} className="fade-in-section section-padding">
      <div className="editorial-container">
        <h2 className="font-display text-2xl md:text-3xl text-center uppercase tracking-[3px] font-light mb-12">
          Explore por Categoria
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridAutoRows: '200px' }}>
          {/* Large card - spans 2 rows */}
          <Link
            to={`/colecoes/${categories[0].handle}`}
            className="relative row-span-2 col-span-2 md:col-span-2 overflow-hidden group bg-muted"
          >
            {/* <!-- SUBSTITUIR: foto real de vestidos --> */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-10">{categories[0].emoji}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-display text-2xl text-primary-foreground uppercase tracking-[2px] font-light">
                {categories[0].name}
              </h3>
              <span className="text-[11px] text-primary-foreground/80 font-body uppercase tracking-[1px] group-hover:text-accent transition-colors">
                Ver mais →
              </span>
            </div>
          </Link>

          {/* 4 smaller cards */}
          {categories.slice(1).map((cat) => (
            <Link
              key={cat.handle}
              to={`/colecoes/${cat.handle}`}
              className="relative overflow-hidden group bg-muted"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-10">{cat.emoji}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-lg text-primary-foreground uppercase tracking-[2px] font-light">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-primary-foreground/80 font-body uppercase tracking-[1px] group-hover:text-accent transition-colors">
                  Ver mais →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
