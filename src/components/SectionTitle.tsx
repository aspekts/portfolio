interface SectionTitleProps {
  symbol: string;
  title: string;
}

const SectionTitle = ({ symbol, title }: SectionTitleProps) => {
  return (
    <div className="mb-12">
      <p className="text-purple-400 font-mono mb-2">{symbol} {title}</p>
      <h2 className="text-3xl font-bold text-white text-balance">{title}</h2>
    </div>
  );
};

export default SectionTitle;