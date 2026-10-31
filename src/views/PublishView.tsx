import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handlePublishSuccess = (_bookId: string, status: string) => {
    if (status === 'local') {
      onToast('Book saved locally to your device in IndexedDB!');
      navigate('/library');
    } else {
      onToast(`Book submitted successfully! Status is "Pending Review".`);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/library');
      }
    }
  };

  return (
    <HtmlBookPublisher
      user={user}
      taxonomies={taxonomies}
      concepts={concepts}
      onPublishSuccess={handlePublishSuccess}
      onCancel={() => navigate(-1)}
    />
  );
};
