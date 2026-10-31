import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConceptNode, TaxonomyNode, UserProfile } from '../types';
import { HtmlBookPublisher } from '../components/publisher/HtmlBookPublisher';

interface PublishViewProps {
  user: UserProfile | null;
  taxonomies: TaxonomyNode[];
  concepts: ConceptNode[];
  onToast: (msg: string) => void;
}

export const PublishView: React.FC<PublishViewProps> = ({
  user,
  taxonomies,
  concepts,
  onToast,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'manage' ? 'manage' : 'create';

  const handlePublishSuccess = (bookId: string, status: string) => {
    if (status === 'local') {
      onToast('Book saved locally to your device in IndexedDB!');
      navigate('/library');
    } else if (status === 'private') {
      onToast('Private edition saved to your cloud account!');
      navigate(`/read/${bookId}`);
    } else {
      onToast(`Book edition submitted successfully! Status is "Pending Review".`);
      navigate(`/read/${bookId}`);
    }
  };

  return (
    <HtmlBookPublisher
      user={user}
      taxonomies={taxonomies}
      concepts={concepts}
      initialMode={initialMode}
      onPublishSuccess={handlePublishSuccess}
      onCancel={() => navigate(-1)}
    />
  );
};
