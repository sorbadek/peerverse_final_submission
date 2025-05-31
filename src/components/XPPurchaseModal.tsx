
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface XPPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const XPPurchaseModal = ({ isOpen, onClose }: XPPurchaseModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Pack',
      xp: '1,000',
      price: '3',
      currency: 'SUI',
      popular: false,
      features: ['1,000 X.P tokens', 'Valid for 1 year', 'Instant delivery']
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      xp: '5,000',
      price: '12',
      currency: 'SUI',
      popular: true,
      features: ['5,000 X.P tokens', '20% bonus X.P', 'Valid for 1 year', 'Instant delivery', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      xp: '15,000',
      price: '30',
      currency: 'SUI',
      popular: false,
      features: ['15,000 X.P tokens', '50% bonus X.P', 'Valid for 2 years', 'Instant delivery', 'Priority support', 'Exclusive features']
    }
  ];

  const handlePurchase = async (planId: string) => {
    setIsProcessing(true);
    setSelectedPlan(planId);
    
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan = plans.find(p => p.id === planId);
      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased ${plan?.xp} X.P tokens for ${plan?.price} ${plan?.currency}.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-yellow-500" />
            Purchase X.P Tokens
          </DialogTitle>
          <DialogDescription>
            Choose a plan to add more X.P tokens to your account and continue your learning journey.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                plan.popular ? 'border-blue-500 shadow-blue-500/20' : 'hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-blue-600">{plan.xp}</div>
                  <div className="text-sm text-gray-500">X.P Tokens</div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.currency}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Purchase for ${plan.price} ${plan.currency}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>How it works:</strong> X.P tokens are used to attend learning sessions. 
            Hosting sessions earns you X.P, while attending sessions consumes X.P. 
            Keep your balance healthy to continue learning!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default XPPurchaseModal;
