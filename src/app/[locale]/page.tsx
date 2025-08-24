import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-6">
            {t('meta.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('meta.description')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Color Showcase Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Color Palette Showcase
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Primary Color */}
            <div className="text-center">
              <div className="w-32 h-32 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Primary</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Deep Blue</h3>
              <p className="text-muted-foreground text-sm">
                Represents water and trust. Creates a calm, reliable impression.
              </p>
              <p className="text-xs text-muted-foreground mt-2">#1565C0</p>
            </div>

            {/* Secondary Color */}
            <div className="text-center">
              <div className="w-32 h-32 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-lg">Secondary</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Teal Green</h3>
              <p className="text-muted-foreground text-sm">
                Evokes waterside nature and tranquility. Harmonizes well with blue.
              </p>
              <p className="text-xs text-muted-foreground mt-2">#26A69A</p>
            </div>

            {/* Tertiary Color */}
            <div className="text-center">
              <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center border">
                <span className="text-muted-foreground font-bold text-lg">Tertiary</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Blue Gray</h3>
              <p className="text-muted-foreground text-sm">
                Creates cleanliness and calmness for backgrounds and spacing.
              </p>
              <p className="text-xs text-muted-foreground mt-2">#ECEFF1</p>
            </div>
          </div>
        </div>
      </section>

      {/* UI Components Demo */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            UI Components
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Example */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                Sample Card
              </h3>
              <p className="text-muted-foreground mb-4">
                This is a sample card component using the tertiary color as background.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity">
                Primary Button
              </button>
            </div>

            {/* Another Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                Action Card
              </h3>
              <p className="text-muted-foreground mb-4">
                This card showcases the secondary color for call-to-action elements.
              </p>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity">
                Call to Action
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                Info Card
              </h3>
              <p className="text-muted-foreground mb-4">
                Clean and minimal design using the defined color palette.
              </p>
              <button className="border border-border text-foreground px-4 py-2 rounded hover:bg-muted transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Experience the power of our unified color palette and design system.
          </p>
          <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity">
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
}
