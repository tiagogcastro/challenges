import Head from 'next/head';

import styles from './styles.module.scss';

export type LayoutProps = {
  children?: React.ReactNode;
  headConfig?: {
    title?: string;
    description?: string;
    favicon?: string;
  }
}

export function Layout({
  children,
  headConfig = {
    title: 'iRecipe',
    description: 'App para um teste na Pro Franchising.',
    favicon: 'favicon.ico'
  },
}: LayoutProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{headConfig?.title}</title>
        <meta 
          name="description" 
          content={headConfig?.description}
        />
        <link rel="icon" href={headConfig?.favicon} />
      </Head>
      {children}
    </div>
  );
}