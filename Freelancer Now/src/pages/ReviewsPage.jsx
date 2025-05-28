import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Star, UserCircle, Building, MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';

    const ReviewsPage = () => {
      const [reviews, setReviews] = useState([]);
      const [showForm, setShowForm] = useState(false);
      const [newReview, setNewReview] = useState({ target_name: '', rating: 0, comment: '' });
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();

      const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('date_posted', { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          toast({ title: "Erro ao Carregar Avaliações", description: "Não foi possível buscar as avaliações.", variant: "destructive" });
        } else {
          setReviews(data || []);
        }
        setLoading(false);
      };

      useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
          setUser(JSON.parse(loggedInUser));
        }
        fetchReviews();
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
      };

      const handleRatingChange = (rating) => {
        setNewReview(prev => ({ ...prev, rating }));
      };

      const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
          toast({ title: "Erro", description: "Você precisa estar logado para deixar uma avaliação.", variant: "destructive" });
          return;
        }
        if (!newReview.target_name || newReview.rating === 0 || !newReview.comment) {
          toast({ title: "Campos Incompletos", description: "Por favor, preencha todos os campos da avaliação.", variant: "destructive" });
          return;
        }

        // Simulação: Tentar encontrar o ID do usuário/empresa avaliado pelo nome.
        // Em um sistema real, seria melhor ter um select de usuários/empresas cadastrados.
        let targetUserId = null;
        let targetCompanyName = null;

        const { data: targetUserSearch } = await supabase
          .from('users')
          .select('id, account_type')
          .or(`nome.ilike.%${newReview.target_name}%,razao_social.ilike.%${newReview.target_name}%`)
          .limit(1)
          .single();

        if (targetUserSearch) {
            if (targetUserSearch.account_type === 'pessoaFisica' || targetUserSearch.account_type === 'pessoaJuridica') { // Assuming freelancers can be rated directly
                targetUserId = targetUserSearch.id;
            } else { // If it's a company, we might store company name if no direct user ID
                targetCompanyName = newReview.target_name; 
            }
        } else {
            // If no user found, assume it's a company name not directly linked to a user row, or a freelancer not found
            targetCompanyName = newReview.target_name;
        }


        const reviewData = {
          author_id: user.id,
          author_name: user.nome || user.razao_social,
          author_type: user.account_type,
          target_user_id: targetUserId,
          target_company_name: targetCompanyName,
          target_name: newReview.target_name,
          rating: newReview.rating,
          comment: newReview.comment,
        };

        const { data: insertedReview, error } = await supabase.from('reviews').insert([reviewData]).select().single();

        if (error) {
          console.error("Error submitting review:", error);
          toast({ title: "Erro ao Enviar", description: error.message || "Não foi possível enviar sua avaliação.", variant: "destructive" });
          return;
        }
        
        setReviews(prev => [insertedReview, ...prev]);
        setNewReview({ target_name: '', rating: 0, comment: '' });
        setShowForm(false);
        toast({ title: "Avaliação Enviada!", description: "Obrigado pelo seu feedback!", variant: "default" });
      };


      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-12 px-4"
        >
          <header className="mb-10 text-center">
            <Star className="mx-auto text-yellow-500 h-16 w-16 mb-4" fill="currentColor" />
            <h1 className="text-4xl font-bold text-blue-700 mb-2">Avaliações da Comunidade</h1>
            <p className="text-lg text-gray-600">Veja o que freelancers e empresas estão dizendo.</p>
          </header>

          {user && (
            <div className="mb-8 text-center">
              <Button onClick={() => setShowForm(!showForm)} className="bg-yellow-400 text-blue-800 hover:bg-yellow-500">
                <MessageSquare className="mr-2 h-5 w-5" /> {showForm ? 'Cancelar Avaliação' : 'Deixar uma Avaliação'}
              </Button>
            </div>
          )}

          {showForm && user && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mb-10">
              <Card className="max-w-2xl mx-auto shadow-lg border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-700">Deixe sua Avaliação</CardTitle>
                  <CardDescription>Compartilhe sua experiência com outros usuários.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label htmlFor="target_name">Para quem é esta avaliação? (Nome do freelancer ou empresa)</Label>
                      <Input id="target_name" name="target_name" value={newReview.target_name} onChange={handleInputChange} placeholder="Ex: João Silva ou Restaurante Saboroso" />
                    </div>
                    <div>
                      <Label>Sua Nota (1 a 5 estrelas)</Label>
                      <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-8 w-8 cursor-pointer transition-colors ${newReview.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                            onClick={() => handleRatingChange(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Seu Comentário</Label>
                      <Textarea id="comment" name="comment" value={newReview.comment} onChange={handleInputChange} placeholder="Descreva sua experiência..." className="min-h-[100px]" />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Enviar Avaliação</Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {loading ? (
             <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="ml-4 text-xl text-gray-600">Carregando avaliações...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: review.id * 0.05 }}>
                  <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        {review.author_type === 'pessoaJuridica' ? <Building className="h-6 w-6 text-blue-600 mr-2" /> : <UserCircle className="h-6 w-6 text-green-600 mr-2" />}
                        <CardTitle className="text-lg">{review.author_name}</CardTitle>
                      </div>
                      <CardDescription>Avaliou: <span className="font-semibold text-gray-700">{review.target_name}</span></CardDescription>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 flex-grow">
                      <p className="italic">"{review.comment}"</p>
                    </CardContent>
                    <CardContent className="text-xs text-gray-500 pt-2 mt-auto">
                      <p>Postado em: {new Date(review.date_posted).toLocaleDateString('pt-BR')}</p>
                       <div className="mt-2 flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 p-1 h-auto">
                          <ThumbsUp className="h-4 w-4 mr-1" /> Útil
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 p-1 h-auto">
                          <ThumbsDown className="h-4 w-4 mr-1" /> Não útil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
              <img  className="mx-auto mb-4 w-48 h-48 opacity-70" alt="Nenhuma avaliação ainda" src="https://images.unsplash.com/photo-1694878981888-7a526050b455" />
              <p className="text-xl text-gray-600">Ainda não há avaliações.</p>
              <p className="text-gray-500">Seja o primeiro a compartilhar sua experiência!</p>
            </div>
          )}
        </motion.div>
      );
    };

    export default ReviewsPage;