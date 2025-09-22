import React from 'react';
import '../styles/glassmorphism.css';
import '../styles/animations.css';

const LoadingSkeleton = ({ type = 'default', count = 1, className = '' }) => {
  const skeletonStyle = {
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 75%)',
    backgroundSize: '200% 100%',
    animation: 'loadingShimmer 1.5s infinite',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden'
  };

  const darkModeStyle = {
    background: 'linear-gradient(90deg, rgba(26, 32, 44, 0.4) 25%, rgba(45, 55, 72, 0.6) 50%, rgba(26, 32, 44, 0.4) 75%)',
    backgroundSize: '200% 100%',
    animation: 'loadingShimmer 1.5s infinite'
  };

  // Default skeleton
  const DefaultSkeleton = () => (
    <div 
      className={`glass loading-skeleton ${className}`}
      style={{ 
        ...skeletonStyle, 
        height: '20px', 
        marginBottom: '10px' 
      }}
    />
  );

  // Card skeleton
  const CardSkeleton = () => (
    <div className={`glass-floating ${className}`} style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ ...skeletonStyle, height: '60px', marginBottom: '1rem', borderRadius: '50%', width: '60px' }} />
      <div style={{ ...skeletonStyle, height: '24px', marginBottom: '1rem' }} />
      <div style={{ ...skeletonStyle, height: '16px', marginBottom: '0.5rem' }} />
      <div style={{ ...skeletonStyle, height: '16px', width: '80%' }} />
    </div>
  );

  // Hero skeleton
  const HeroSkeleton = () => (
    <div className={`glass-hero ${className}`} style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
      <div style={{ ...skeletonStyle, height: '48px', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }} />
      <div style={{ ...skeletonStyle, height: '20px', marginBottom: '1rem', maxWidth: '400px', margin: '0 auto 1rem' }} />
      <div style={{ ...skeletonStyle, height: '50px', width: '200px', margin: '2rem auto', borderRadius: '25px' }} />
    </div>
  );

  // Service grid skeleton
  const ServiceGridSkeleton = () => (
    <div className={className} style={{ marginBottom: '3rem' }}>
      <div style={{ ...skeletonStyle, height: '36px', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }} />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem' 
      }}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="glass-service-card" style={{ padding: '2rem' }}>
            <div style={{ 
              ...skeletonStyle, 
              height: '60px', 
              width: '60px', 
              marginBottom: '1rem', 
              borderRadius: '50%',
              margin: '0 auto 1rem'
            }} />
            <div style={{ ...skeletonStyle, height: '24px', marginBottom: '1rem' }} />
            <div style={{ ...skeletonStyle, height: '16px', marginBottom: '0.5rem' }} />
            <div style={{ ...skeletonStyle, height: '16px', width: '90%' }} />
          </div>
        ))}
      </div>
    </div>
  );

  // List skeleton
  const ListSkeleton = () => (
    <div className={`glass ${className}`} style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ ...skeletonStyle, height: '40px', width: '40px', borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...skeletonStyle, height: '16px', marginBottom: '0.5rem', width: '60%' }} />
          <div style={{ ...skeletonStyle, height: '14px', width: '40%' }} />
        </div>
      </div>
    </div>
  );

  // Text skeleton
  const TextSkeleton = () => (
    <div className={className}>
      <div style={{ ...skeletonStyle, height: '20px', marginBottom: '0.75rem' }} />
      <div style={{ ...skeletonStyle, height: '20px', marginBottom: '0.75rem', width: '90%' }} />
      <div style={{ ...skeletonStyle, height: '20px', width: '60%' }} />
    </div>
  );

  // Button skeleton
  const ButtonSkeleton = () => (
    <div 
      className={className}
      style={{ 
        ...skeletonStyle, 
        height: '44px', 
        width: '120px',
        borderRadius: '22px'
      }} 
    />
  );

  // Avatar skeleton
  const AvatarSkeleton = () => (
    <div 
      className={className}
      style={{ 
        ...skeletonStyle, 
        height: '40px', 
        width: '40px',
        borderRadius: '50%'
      }} 
    />
  );

  // Table skeleton
  const TableSkeleton = () => (
    <div className={`glass ${className}`} style={{ padding: '1.5rem' }}>
      {[...Array(5)].map((_, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ ...skeletonStyle, height: '16px', flex: '2' }} />
          <div style={{ ...skeletonStyle, height: '16px', flex: '1' }} />
          <div style={{ ...skeletonStyle, height: '16px', flex: '1' }} />
          <div style={{ ...skeletonStyle, height: '32px', width: '80px', borderRadius: '16px' }} />
        </div>
      ))}
    </div>
  );

  // Form skeleton
  const FormSkeleton = () => (
    <div className={`glass-form ${className}`}>
      <div style={{ ...skeletonStyle, height: '36px', marginBottom: '2rem' }} />
      {[...Array(4)].map((_, index) => (
        <div key={index} style={{ marginBottom: '1.5rem' }}>
          <div style={{ ...skeletonStyle, height: '16px', width: '30%', marginBottom: '0.5rem' }} />
          <div style={{ ...skeletonStyle, height: '44px', borderRadius: '8px' }} />
        </div>
      ))}
      <div style={{ ...skeletonStyle, height: '44px', width: '120px', borderRadius: '22px', marginTop: '2rem' }} />
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />;
      case 'hero':
        return <HeroSkeleton />;
      case 'service-grid':
        return <ServiceGridSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'text':
        return <TextSkeleton />;
      case 'button':
        return <ButtonSkeleton />;
      case 'avatar':
        return <AvatarSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'form':
        return <FormSkeleton />;
      default:
        return <DefaultSkeleton />;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes loadingShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        [data-theme="dark"] .loading-skeleton {
          background: linear-gradient(
            90deg,
            rgba(26, 32, 44, 0.4) 25%,
            rgba(45, 55, 72, 0.6) 50%,
            rgba(26, 32, 44, 0.4) 75%
          ) !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .loading-skeleton {
            animation: none !important;
            background: rgba(255, 255, 255, 0.2) !important;
          }
          
          [data-theme="dark"] .loading-skeleton {
            background: rgba(45, 55, 72, 0.5) !important;
          }
        }
      `}</style>
    </>
  );
};

export default LoadingSkeleton;
