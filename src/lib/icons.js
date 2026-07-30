import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Key,
  Users,
  User,
  Activity,
  Clock,
  Globe,
  Tag,
  FileText,
  Settings,
  Layers,
  Box,
  Boxes,
  Terminal,
  Lock,
  Mail,
  MapPin,
  Zap,
  Radio,
  RefreshCw,
  Folder,
  Binary,
  Hash,
  ToggleLeft,
  Slash,
  Brain,
  HelpCircle,
  Code,
  List,
  CheckCircle2,
  Sliders,
  Share2,
  Container,
  Component,
  Workflow
} from 'lucide-react';

import {
  KubernetesLogo,
  DockerLogo,
  PostgresLogo,
  RedisLogo,
  MongoLogo,
  UbuntuLogo,
  VmLogo,
  NginxLogo,
  KafkaLogo,
  NodejsLogo,
  AwsLogo,
  PythonLogo
} from '../components/TechLogos';

export function resolveIcon(key = '', kind = '') {
  const k = key.toLowerCase();

  // Official Real Tech Brand Logos with Authentic Colors
  if (/kubernetes|k8s|kube|pod|helm/i.test(k)) return KubernetesLogo;
  if (/docker|container|image/i.test(k)) return DockerLogo;
  if (/postgres|postgresql|psql/i.test(k)) return PostgresLogo;
  if (/redis|cache|memorystore/i.test(k)) return RedisLogo;
  if (/mongo|mongodb/i.test(k)) return MongoLogo;
  if (/ubuntu|debian|redhat|centos|linux/i.test(k)) return UbuntuLogo;
  if (/vm|virtual|vms|vmware|instance/i.test(k)) return VmLogo;
  if (/nginx|proxy|ingress/i.test(k)) return NginxLogo;
  if (/kafka|queue|rabbitmq|mq/i.test(k)) return KafkaLogo;
  if (/node|nodejs|express/i.test(k)) return NodejsLogo;
  if (/aws|amazon|cloud|s3|ec2/i.test(k)) return AwsLogo;
  if (/python|py|django|flask/i.test(k)) return PythonLogo;

  // Infrastructure Tech Categories
  if (/cluster|namespace|fleet|datacenter/i.test(k)) return Boxes;
  if (/server|host|node|worker|app-server|db-server/i.test(k)) return Server;
  if (/db|database|sql|store/i.test(k)) return Database;
  if (/os|kernel|cpu|core|proc|processor/i.test(k)) return Cpu;
  if (/disk|storage|memory|ram|volume|drive|mount|capacity|gb|tb/i.test(k)) return HardDrive;
  if (/net|network|ip|subnet|firewall|port|route|dns|gateway|mac|vpc/i.test(k)) return Network;
  if (/auth|secret|key|token|cert|password|cred/i.test(k)) return Key;
  if (/sec|security|rule|policy|guard|shield|acl/i.test(k)) return Shield;
  if (/users|team|members|group|accounts/i.test(k)) return Users;
  if (/user|admin|owner|author|creator/i.test(k)) return User;
  if (/log|metric|event|monitor|trace|status|health|active|busy|online/i.test(k)) return Activity;
  if (/time|date|cron|uptime|created|updated|expires/i.test(k)) return Clock;
  if (/geo|location|region|zone|country|city|url|http|endpoint|domain/i.test(k)) return Globe;
  if (/tag|label|category|type|flag/i.test(k)) return Tag;
  if (/config|setting|opt|param|env/i.test(k)) return Settings;
  if (/service|api|app|microservice|gateway/i.test(k)) return Share2;
  if (/workflow|pipeline|job|task/i.test(k)) return Workflow;

  // Fallbacks by kind
  switch (kind?.toLowerCase()) {
    case 'object':
      return Layers;
    case 'array':
      return Boxes;
    case 'string':
      return Component;
    case 'number':
      return Hash;
    case 'boolean':
      return ToggleLeft;
    case 'null':
      return Slash;
    default:
      return Box;
  }
}

export {
  Brain,
  KubernetesLogo,
  DockerLogo,
  PostgresLogo,
  RedisLogo,
  MongoLogo,
  UbuntuLogo,
  VmLogo,
  NginxLogo,
  KafkaLogo,
  NodejsLogo,
  AwsLogo,
  PythonLogo
};
