// TermsAcceptance.tsx
import React from 'react';
import { Container, Typography, Button, Skeleton } from '@mui/material';
import Layout from '../Layout';
import { useGlobal } from '../../contexts/GlobalContext';

const TermsAcceptance: React.FC = () => {
    const { isLoading } = useGlobal();
    return (
        <Layout>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                {/* Skeleton para carregamento */}
                {isLoading ? 
                <>
                    <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
                </>
                :
                <>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Aceite dos Termos de Uso
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Bem-vindo à ShoppeFood. Antes de começar a usar nossos serviços, é importante que você leia e compreenda os termos de uso a seguir.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Definições
                    </Typography>
                    <Typography variant="body1" paragraph>
                        "Usuário" refere-se a qualquer pessoa que utilize a plataforma ShoppeFood. "Serviços" referem-se a todos os serviços oferecidos pela plataforma, incluindo, mas não se limitando a, compras, vendas e gestão de pedidos.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Aceitação dos Termos
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Ao acessar ou usar nossos serviços, você concorda em estar vinculado a estes termos. Se você não concorda, não deve usar nossos serviços.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Direitos e Obrigações
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Os usuários têm o direito de acessar e utilizar os serviços oferecidos pela plataforma. É obrigação do usuário fornecer informações precisas e atualizadas durante o cadastro e o uso da plataforma.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Política de Privacidade
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sua privacidade é importante para nós. Para saber como coletamos, usamos e protegemos suas informações pessoais, consulte nossa <a href="/privacy-policy">Política de Privacidade</a>.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Limitação de Responsabilidade
                    </Typography>
                    <Typography variant="body1" paragraph>
                        A ShoppeFood não se responsabiliza por danos diretos, indiretos ou consequenciais que possam resultar do uso ou da incapacidade de uso dos serviços. A utilização dos serviços é de sua responsabilidade.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Modificações dos Termos
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Nós nos reservamos o direito de alterar estes termos a qualquer momento. Você será notificado sobre mudanças importantes por meio de comunicação direta ou através de notificações na plataforma.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Legislação Aplicável
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar conflitos de disposições legais.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Aceite
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Ao clicar no botão abaixo, você concorda com os termos apresentados.
                    </Typography>
                    <Button variant="contained" color="primary">
                        Aceito
                    </Button>

                    <Typography variant="h6" component="h2" gutterBottom>
                        Contato
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Se você tiver alguma dúvida, entre em contato conosco em suporte@shoppefood.com.
                    </Typography>
                </>
                }
            </Container>
        </Layout>
    );
};

export default TermsAcceptance;
