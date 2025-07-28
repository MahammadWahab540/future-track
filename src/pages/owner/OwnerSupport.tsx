import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Shield, UserX } from 'lucide-react';

export const OwnerSupport = () => {
  const mockTickets = [
    { id: '1', title: 'Login Issues', status: 'open', priority: 'high', tenant: 'Acme Corp' },
    { id: '2', title: 'Feature Request', status: 'assigned', priority: 'medium', tenant: 'TechStart' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support & Audit</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === 'open' ? 'destructive' : 'default'}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Recent platform activities logged here</p>
            <Button className="mt-4" variant="outline">
              <UserX className="mr-2 h-4 w-4" />
              Force Logout User
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};